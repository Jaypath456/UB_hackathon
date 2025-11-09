from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import json
from .models import Device, Buildings
from django.conf import settings
from jose import jwt
import requests
from django.contrib.auth.models import User
import asyncio
# Create your views here.

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("dashboard")
            else:
                error = "Invalid username or password"
                return render(request, "login.html", {"form": form, "error": error})
        else:
            error = "Please enter valid credentials."
            return render(request, "login.html", {"form": form, "error": error})
    else:
        form = AuthenticationForm()

    auth0_login_url = (
        f"https://{settings.AUTH0_DOMAIN}/authorize?"
        f"response_type=code&"
        f"scope=openid profile email&"
        f"client_id={settings.AUTH0_CLIENT_ID}&"
        f"redirect_uri={settings.AUTH0_CALLBACK_URL}"
    )

    return render(request, "login.html", {"auth0_login_url": auth0_login_url})


@login_required(login_url="/")
def logout_view(request):
    logout(request)
    request.session.flush()
    redirect_url = request.session.pop("logout_redirect_url", "login")
    return redirect(redirect_url)

@csrf_exempt
def receive_iot_data(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8"))
            serial_no = payload.get("serial")
            temperature = payload.get("temperature")
            location = payload.get("location")

            device, _ = Device.objects.get_or_create(serial_no=serial_no)

            Buildings.objects.create(temp=temperature, location=location, device=device)

            return JsonResponse({"status": "success"}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "POST method required"}, status=405)

def callback(request):
    code = request.GET.get("code")
    if not code:
        return HttpResponse("Error: No code parameter provided", status=400)

    token_url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"
    token_payload = {
        "grant_type": "authorization_code",
        "client_id": settings.AUTH0_CLIENT_ID,
        "client_secret": settings.AUTH0_CLIENT_SECRET,
        "code": code,
        "redirect_uri": settings.AUTH0_CALLBACK_URL,
    }
    token_info = requests.post(token_url, data=token_payload).json()
    id_token = token_info.get("id_token")
    if not id_token:
        print("Token response:", token_info)
        return HttpResponse("Error: No ID token returned", status=400)

    jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    jwks = requests.get(jwks_url).json()
    unverified_header = jwt.get_unverified_header(id_token)

    rsa_key = next(
        (
            {"kty": key["kty"], "n": key["n"], "e": key["e"]}
            for key in jwks["keys"]
            if key["kid"] == unverified_header["kid"]
        ),
        None,
    )

    if not rsa_key:
        return HttpResponse("Error: RSA key not found", status=400)

    try:
        user_info = jwt.decode(
            id_token,
            rsa_key,
            algorithms=["RS256"],
            audience=settings.AUTH0_CLIENT_ID,
            issuer=f"https://{settings.AUTH0_DOMAIN}/",
        )
    except Exception as e:
        return HttpResponse(f"Token verification failed: {e}", status=400)

    email = user_info.get("email")
    if not email:
        return HttpResponse("Error: Email not found in token", status=400)

    user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
    login(request, user)
    return redirect("dashboard")

@login_required
def dashboard(request):
    
    return render(request, 'dashboard.html')

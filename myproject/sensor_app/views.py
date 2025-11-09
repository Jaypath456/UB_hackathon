from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect, render

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Device, Buildings
import asyncio
from asgiref.sync import sync_to_async


# Create your views here.


def login_view(request):
    # if request.method == "POST":
    #     form = AuthenticationForm(request, data=request.POST)
    #     if form.is_valid():
    #         username = form.cleaned_data.get("username")
    #         password = form.cleaned_data.get("password")
    #         user = authenticate(username=username, password=password)

    #         if user is not None:
    #             if user.groups.filter(name="user").exists():
    #                 login(request, user)
    #                 return redirect("home_view")

    #         else:
    #             error = "Invalid username or password"
    #             return render(request, "login.html", {"form": form, "error": error})
    #     else:
    #         error = "Please enter valid credentials."
    #         return render(request, "login.html", {"form": form, "error": error})
    # else:
    #     form = AuthenticationForm()

    # return render(request, "login.html", {"form": form})
    return render(request, "login.html")


@login_required(login_url="/")
def logout_view(request):
    logout(request)
    request.session.flush()
    redirect_url = request.session.pop("logout_redirect_url", "login")
    return redirect(redirect_url)

@csrf_exempt
def receive_iot_data(request):
    print("request method", request.method)
    if request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8"))
            print("payload", payload)
            serial_no = payload.get("serial")
            temperature = payload.get("temperature")
            location = payload.get("location")
            # timestamp = payload.get("location")
            device, _ =Device.objects.get_or_create(serial_no=serial_no)

            Buildings.objects.create(temp=temperature, location=location, device=device)

            return JsonResponse({"status": "success"}, status=201)
        except Exception as e:
            print("Exception occurred", e)
            return JsonResponse({"error":"Invalid payload"})
    else:
        return JsonResponse({"error":"unsupported method"})    

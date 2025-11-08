from django.shortcuts import redirect, render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

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


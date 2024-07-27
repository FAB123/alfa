<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('token');
        } else {
            return Inertia::render('Login/LoginScreen');
        }
    }

    public function doLogin(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')], request('remember'))) {
            $request->session()->regenerate();
            return redirect()->route('token');
        } else {
            return redirect()->route('login')->with('message', 'Invalid Login Data');
        }
    }

    public function logout(Request $request)
    {
        auth()->logout();
        $request->session()->flush();
        return redirect()->route('login');
    }
}

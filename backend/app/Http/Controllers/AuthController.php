<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(CreateUserRequest $request)
    {
        try {
            User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
            ]);
            return response()->json(["status" => true, "message" => "User registered successfully!"], 201);
        } catch (\Exception $e) {
            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

    public function login(LoginUserRequest $request)
    {
        $data = $request->only('email', 'password');

        if (Auth::attempt($data)) {
            $token = JWTAuth::fromUser(Auth::user());
            return response()->json(["status" => true, "message" => "User login successfully", "token" => $token]);
        } else {
            return response()->json(["status" => false, "message" => "Email or password is wrong"],400);
        }

    }


    public function logout(Request $request)
    {
        if ($request->token) {
            JWTAuth::parseToken()->invalidate(true);

            Auth::logout();

            return response()->json(["status" => true, "message" => "User logged out successfully"]);
        } else {
            return response()->json(["status" => false, "message" => "Token not provided"],401);
        }
    }

    public function checkRole(Request $request){
        return response()->json(["role"=>Auth::user()->role]);
    }

}

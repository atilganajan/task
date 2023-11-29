<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(CreateUserRequest $request)
    {
        try {

            Log::info('Creating user: ' . $request->email);

            User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
            ]);

            Log::info('User created successfully: ' . $request->email);

            return response()->json(["status" => true, "message" => "User registered successfully!"], 201);
        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

    public function login(LoginUserRequest $request)
    {
        try {

            Log::info('User attempting to log in with email: ' . $request->email);

            $data = $request->only('email', 'password');

            if (Auth::attempt($data)) {
                Log::info('User login successful: ' . $request->email);

                $token = JWTAuth::fromUser(Auth::user());
                return response()->json(["status" => true, "message" => "User login successfully", "token" => $token]);
            } else {
                Log::warning('User login failed for email: ' . $request->email);

                return response()->json(["status" => false, "message" => "Email or password is wrong"],400);
            }
        }catch (\Exception $e){
            Log::error('Error during user login: ' . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }


    public function logout(Request $request)
    {
        try {
           $user = Auth::user();

            Log::info("User {$user->name} (ID: {$user->id}) attempting to log out");

            if ($request->token) {

                Log::info("Invalidating token and logging out user ID: {$user->id}");

                JWTAuth::parseToken()->invalidate(true);

                Auth::logout();

                Log::info("User ID: {$user->id} logged out successfully");

                return response()->json(["status" => true, "message" => "User logged out successfully"]);
            } else {

                Log::warning("Token not provided during logout attempt for user ID: {$user->id}");

                return response()->json(["status" => false, "message" => "Token not provided"],401);
            }
        }catch (\Exception $e){
            Log::error('Error during user logout: ' . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }
    }

    public function checkRole(Request $request){
        return response()->json(["role"=>Auth::user()->role]);
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminController extends Controller
{

    public function login()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        } else {
            return Inertia::render('Admin/LoginScreen');
        }
    }

    public function doLogin(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        if (Auth::guard('admin')->attempt(['name' => $request->input('email'), 'password' => $request->input('password')], request('remember'))) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        } else {
            return redirect()->route('admin.login')->with('message', 'Invalid Login Data');
        }
    }

    public function logout(Request $request)
    {
        auth('admin')->logout();
        $request->session()->flush();
        return redirect()->route('admin.login');
    }

    public function dashboard()
    {
        $customers = User::select('name', 'shop_name', 'shop_name_ar', 'email', 'id')->withCount('counters')->get();
        return Inertia::render('Admin/ListCustomers', [
            'customers' => $customers,
        ]);
    }

    public function detail_customer($counter_id)
    {
        $account = User::select(
            'users.id',
            'users.name',
            'users.shop_name',
            'users.shop_name_ar',
            'users.shop_id',
            'users.email',
            'users.images',
            'users.welcome_text',
            'users.welcome_text_ar',
            'tokens.title as ordering_counter',
            'users.enable_ordering'
        )
            ->with('counters')
            ->leftJoin('tokens', 'tokens.id', 'users.ordering_counter')
            ->find(decrypt($counter_id));

        return Inertia::render('Admin/DetailCustomers', [
            'account' => $account,
        ]);
        return Inertia::render('Admin/ListCustomers');
    }

    public function add_customer()
    {
        return Inertia::render('Admin/AddCustomer');
    }

    public function edit_customer($customer_id)
    {
        return Inertia::render('Admin/AddCustomer', [
            'customerId' => $customer_id,
        ]);
    }

    public function save_account(Request $request)
    {
        try {
            $request->validate([
                'account_name' => 'required|string|max:255',
                'shop_name' => 'required|string|max:255',
                'shop_name_ar' => 'nullable|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            User::create([
                'name' => $request->input('account_name'),
                'shop_name' => $request->input('shop_name'),
                'shop_name_ar' => $request->input('shop_name_ar'),
                'email' => $request->input('email'),
                'shop_id' => rand(11111111, 99999999),
                'password' => bcrypt($request->input('password'),),
            ]);
            return redirect()->route('admin.dashboard')->with('success', 'Account created successfully.');
        } catch (\Throwable $th) {
            Log::error('Error saving account: ' . $th->getMessage());
            return redirect()->route('admin.add_customer')->with('error', 'Error saving data');
        }
    }

    public function save_counter(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'max_count' => 'required|integer|min:1',
                'kiosk_mode' => 'required|boolean',
                'encrypted_counter' => 'nullable|string',
                'encrypted_user' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => $validator->errors(),
                ], 422);
            }

            $counterId = $request->input('encrypted_counter') ? decrypt($request->input('encrypted_counter')) : null;
            $userId = decrypt($request->input('encrypted_user'));

            Token::updateOrCreate(
                ['id' => $counterId],
                [
                    'title' => $request->input('title'),
                    'max_count' => $request->input('max_count'),
                    'kiosk_mode' => $request->input('kiosk_mode'),
                    'user_id' => $userId,
                    // 'last_reset' => Carbon::now(),
                ]
            );

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error updating or creating token: ' . $th->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }

    public function delete_counter($encrypted_counter)
    {
        try {
            $counter = decrypt($encrypted_counter);
            Token::find($counter)->delete();
            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error Deleting token: ' . $th->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }

    public function save_enable_ordering(Request $request)
    {
        try {
            $enable = $request->input('enable');
            $counter = $enable ? decrypt($request->input('counter')) : null;
            $user = decrypt($request->input('encrypted_user'));

            User::updateOrCreate(
                ['id' => $user],
                [
                    'ordering_counter' => $counter,
                    'enable_ordering' => $enable,
                ]
            );

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error updating or creating welcome text: ' . $th->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }

    public function save_welcome_text(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'welcome_text' => 'required|string|max:300',
                'welcome_text_ar' => 'required|string|max:300',
                'encrypted_user' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => $validator->errors(),
                ], 422);
            }

            $userId = decrypt($request->input('encrypted_user'));

            User::updateOrCreate(
                ['id' => $userId],
                [
                    'welcome_text' => $request->input('welcome_text'),
                    'welcome_text_ar' => $request->input('welcome_text_ar'),
                ]
            );

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error updating or creating welcome text: ' . $th->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }


    public function save_shop_image(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'images' => 'required',
                'encrypted_user' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => $validator->errors(),
                ], 422);
            }

            $userId = decrypt($request->input('encrypted_user'));

            User::updateOrCreate(
                ['id' => $userId],
                [
                    'images' => $request->input('images'),
                ]
            );

            return response()->json([
                'error' => false,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error updating or creating welcome text: ' . $th->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }
}

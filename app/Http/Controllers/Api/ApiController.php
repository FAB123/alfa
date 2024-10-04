<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Token;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    public function doApiLogin(Request $request)
    {
        $user = User::where('email', $request->input('email'))->first();
        if ($user && Hash::check($request->input('password'), $user->password)) {
            $token = $user->createToken('for-api')->plainTextToken;
            return response()->json([
                'auth' => true,
                'shop_id' => base64_encode($user->shop_id),
                'shop_name' => $user->shop_name,
                'shop_name_ar' => $user->shop_name_ar,
                'token' => $token,
                'message' => 'login Successfully',
            ], 200);
        } else {
            return response()->json([
                'auth' => false,
                'message' => 'login Failed',
            ], 401);
        }
    }

    public function fetch_all_items()
    {
        try {
            $user = auth()->user();
            $items = Item::where('shop_id', $user->shop_id)->get();
            return response()->json([
                'status' => true,
                'items' => $items->groupBy('category'),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'status' => false,
            ], 200);
        }
    }

    public function getCouterData()
    {
        try {
            $user = auth()->user();

            $counter = Token::select('id', 'issued_count', 'max_count', 'title')
                ->where('kiosk_mode', 1)
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'status' => true,
                'counter' => $counter->makeVisible('id'),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    public function getAllCouterData()
    {
        try {
            $user = auth()->user();
            $counter = Token::select('id', 'count', 'issued_count', 'max_count', 'title', 'kiosk_mode')
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'status' => true,
                'counter' => $counter->makeVisible('id'),
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
            ], 200);
        }
    }


    //update_token_display
    public function update_token_display()
    {
        try {
            $user = auth()->user();
            $counter = Token::select('id', 'issued_count', 'title', 'kiosk_mode')
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'status' => true,
                'counter' => $counter
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
            ], 200);
        }
    }


    public function logout()
    {
        try {
            auth()->logout();
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function update_token(Request $request)
    {
        try {
            $user = auth()->user();
            $counter = decrypt($request->input('counter'));
            $token = Token::where('id', $counter)->first();

            if (!$token) {
                return response()->json([
                    'status' => false,
                    'message' => 'Token not found'
                ], 404);
            }

            if ($token->max_count == $token->issued_count) {
                $token->issued_count = 1;
                $token->save();
            } else {
                $token->increment('issued_count', 1);
            }

            $counters = Token::select('title', 'count', 'issued_count', 'id')
                ->where('user_id', $user->id)
                ->where('kiosk_mode', 1)
                ->get();

            return response()->json([
                'counter' => $counters->makeVisible('id'),
                'token' => $token->makeVisible('id'),
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }

    public function update_token_manualy(Request $request)
    {
        try {
            $user = auth()->user();
            $counter = decrypt($request->input('counter'));
            $token_number = $request->input('token');
            $token = Token::where('id', $counter)->first();

            if (!$token) {
                return response()->json([
                    'status' => false,
                    'message' => 'Token not found'
                ], 404);
            }

            $token->issued_count = $token->max_count < $token_number ? $token->max_count : $token_number;
            $token->save();

            $counters = Token::select('title', 'count', 'issued_count', 'id')
                ->where('user_id', $user->id)
                ->where('kiosk_mode', 1)
                ->get();

            return response()->json([
                'data' => [
                    'counter' => $counters->makeVisible('id'),
                    'token' => $token->makeVisible('id'),
                ],
                'status' => true,

            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }



    public function getLicenceData()
    {
        try {
            $user = auth()->user();

            $expired = Carbon::now()->diffInDays($user->expire_date) > -1 ? false : true;
            $expired_text =  $expired ? ' before expired' : ' remaining';

            return response()->json([
                'data' => [
                    'message' => Carbon::now()->diffForHumans($user->expire_date, true) . $expired_text,
                    'expired' => $expired,
                ],
                'status' => true,

            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
            ], 200);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\RecallCounter;
use App\Events\UpdateCounter;
use App\Models\Token;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TokenController extends Controller
{
    public function index()
    {
        $user = [
            'shop_name' => auth()->user()->shop_name,
            'shop_id' => auth()->user()->shop_id,
            'shop_name_ar' => auth()->user()->shop_name_ar,
            'counters' => auth()->user()->counters,
            'encrypted_user' => auth()->user()->encrypted_user,
            'enable_ordering' => auth()->user()->enable_ordering
        ];
        return Inertia::render('Token/UpdateToken', [
            'user' => $user,
        ]);
    }

    public function updateTokenCounter(Request $request)
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

            if ($token->max_count === $token->count) {
                $token->count = 1;
                $token->save();
            } else {
                $token->increment('count', 1);
            }

            $message = Token::select('title', 'count', 'id', 'issued_count', 'kiosk_mode', 'max_count')
                ->where('user_id', $user->id)
                ->get();

            try {
                broadcast(new UpdateCounter($message->makeVisible('id')->toArray(), base64_encode($user->shop_id)));
            } catch (\Throwable $th) {
                info('sending token error');
            }

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }

    public function update_token_by_count(Request $request)
    {
        try {
            $user = auth()->user();
            $counter = decrypt($request->input('counter'));
            $token_number = $request->input('token');

            $token = Token::where('id', $counter)->first();

            if (!$token) {
                return response()->json([
                    'status' => false,
                    'message' => 'Counter not found'
                ], 404);
            } else {
                if ($token_number > 0 && $token_number < $token->max_count) {
                    $token->count = $token_number;
                    $token->save();
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => "Token should be between 0 to $token->max_count"
                    ], 200);
                }
            }

            $message = Token::select('title', 'count', 'id', 'issued_count', 'kiosk_mode', 'max_count')
                ->where('user_id', $user->id)
                ->get();

            try {
                broadcast(new UpdateCounter($message->makeVisible('id')->toArray(), base64_encode($user->shop_id)));
            } catch (\Throwable $th) {
                info('sending token error');
            }

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 200);
        }
    }

    public function recall_token_display(Request $request)
    {
        try {
            $user = auth()->user();
            $counter = decrypt($request->input('counter_id'));
            broadcast(new RecallCounter($counter, base64_encode($user->shop_id)));
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

    public function decrement_token_display(Request $request)
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

            if (!$token->count <= 1) {
                $token->decrement('count', 1);
            }

            $message = Token::select('title', 'count', 'id', 'issued_count', 'kiosk_mode', 'max_count')
                ->where('user_id', $user->id)
                ->get();

            try {
                broadcast(new UpdateCounter($message->makeVisible('id')->toArray(), base64_encode($user->shop_id)));
            } catch (\Throwable $th) {
                info('sending token error');
            }

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }

    public function updateTokenData()
    {
        try {
            $message = Token::select('title', 'count', 'id', 'issued_count', 'kiosk_mode')
                ->where('user_id', auth()->user()->id)
                ->get();

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }

    public function resetTokenCounter(Request $request)
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

            $token->count = 0;
            $token->last_reset = Carbon::now();
            $token->save();

            $message = Token::select('title', 'count', 'id')
                ->where('user_id', $user->id)
                ->get();

            try {
                broadcast(new UpdateCounter($message->makeVisible('id')->toArray(), base64_encode($user->shop_id)));
            } catch (\Throwable $th) {
                info('sending token error');
            }

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            // Use a more specific exception handling if possible
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }

    public function resetIssueTokenCounter(Request $request)
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

            $token->issued_count = 0;
            $token->last_reset = Carbon::now();
            $token->save();

            $message = Token::select('title', 'count', 'issued_count', 'id')
                ->where('user_id', $user->id)
                ->where('kiosk_mode', 1)
                ->get();
            // try {
            //     broadcast(new UpdateCounter($message->makeVisible('id')->toArray(), base64_encode($user->shop_id)));
            // } catch (\Throwable $th) {
            //     info('sending token error');
            // }

            return response()->json([
                'data' => $message,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            // Use a more specific exception handling if possible
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }


    public function requestApiData(Request $request)
    {
        try {
            $shop_id = base64_decode($request->input('encrypted_shop_id'));

            $user = User::where('shop_id', $shop_id)->first();
            if (!$user) {
                return response()->json([
                    'data' => 'invalid shop id',
                    'status' => false,
                ], 200);
            }

            $message = Token::select('title', 'count', 'id')
                ->where('user_id', $user->id)
                ->get();


            $company = [
                "shop_name" => $user->shop_name,
                "shop_name_ar" => $user->shop_name_ar,
                "welcome_text" => $user->welcome_text,
                "welcome_text_ar" => $user->welcome_text_ar,
                "images" =>  $user->images,
                "shop_id" => base64_encode($user->shop_id)
            ];

            return response()->json([
                'data' => $message->makeVisible('id'),
                'company_data' => $company,
                'status' => true,
            ], 200);
        } catch (\Throwable $th) {
            // Use a more specific exception handling if possible
            info($th->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'An error occurred'
            ], 500);
        }
    }
}

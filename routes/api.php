<?php

use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\TokenController;
use Illuminate\Support\Facades\Route;

Route::post('/request-shop-data', [TokenController::class, 'requestApiData']);

Route::group(['prefix' => 'v2'], function () {
    Route::post("login", [ApiController::class, 'doApiLogin']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::controller(ApiController::class)->group(function () {
            Route::get("logout", 'logout');
            Route::get('get-couter-data', 'getCouterData');
            Route::get('get-licence-data', 'getLicenceData');
            Route::get('fetch-all-items', 'fetch_all_items');
            Route::post("update-token", 'update_token');
            Route::post('update_token_manualy', 'update_token_manualy');
            Route::get('get-all-couter-data', 'getAllCouterData');
        });

        Route::controller(TokenController::class)->group(function () {
            Route::post("update_token_display", 'updateTokenCounter');
            Route::post("decrement_token_display", 'decrement_token_display');
            Route::post('update_token_by_count', 'update_token_by_count');
            Route::get("update_data", 'updateTokenData');
            Route::post("reset_token", 'resetTokenCounter');
            Route::post("reset_issue_token", 'resetIssueTokenCounter');
            Route::post("recall_token_display", 'recall_token_display');

            
        });


        Route::controller(ItemController::class)->group(function () {
            Route::group(['prefix' => 'orders'], function () {
                Route::post("save-order", 'save_order');
                Route::get('get-order-list/{mode}/{dir}', 'getOrderList');
                Route::post('update-order-item', 'update_order_item');
            });
        });
    });
});

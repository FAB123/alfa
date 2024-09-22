<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\TokenController;
use Illuminate\Support\Facades\Route;

//Login Functions
Route::controller(LoginController::class)->group(function () {
    Route::get('/', 'index')->name('home');
    Route::get('/login', 'index')->name('login');
    Route::post('/login', 'dologin')->name('do.login');
    Route::get('/logout', 'logout')->name('logout');
});

Route::middleware('auth')->group(function () {
    //Token routes
    Route::controller(TokenController::class)->group(function () {
        Route::group(['prefix' => 'token'], function () {
            Route::get('/', 'index')->name('token');
            Route::post('update_token', 'updateTokenCounter')->name('update_token');
            Route::post("decrement_token_display", 'decrement_token_display');
            Route::post('reset_token', 'resetTokenCounter')->name('reset_token');
            Route::get('update_data', 'updateTokenData')->name('update_data');
            Route::post("recall_token_display", 'recall_token_display');
            Route::post('update_token_by_count', 'update_token_by_count');

        });
    });

    Route::controller(ItemController::class)->group(function () {
        Route::group(['prefix' => 'orders'], function () {
            Route::get('/', 'index')->name('orders');
            Route::get('manage-items', 'manage_items');
            Route::get("manage-tags", 'manage_tags');
            Route::post("save-tag", 'save_tag');
            Route::get('delete-tag/{item}', 'delete_tag');
            Route::get('get-order-list/{mode}/{dir}', 'getOrderList');
            Route::post('update-order-item', 'update_order_item');
            Route::get("items/{page}/{size}/{keyword}/{sortitem}/{sortdir}", 'get_items');
            Route::post("save-item", 'save_item');
            Route::get('delete-item/{item}', 'delete_item');
        });
    });
});

//Token routes
Route::controller(AdminController::class)->group(function () {
    Route::group(['prefix' => 'admin'], function () {
        Route::get('/login', 'login')->name('admin.login');
        Route::post('/login', 'dologin')->name('do.admin.login');
        Route::get('/logout', 'logout')->name('do.logout');
        Route::middleware('auth:admin')->group(function () {
            Route::get('/dashboard', 'dashboard')->name('admin.dashboard');
            Route::get('/add_customer', 'add_customer')->name('admin.add_customer');
            Route::post('/save-account', 'save_account')->name('admin.save_account');
            Route::post('/save-counter', 'save_counter')->name('admin.save_counter');
            Route::get('/delete-counter/{counter_id}', 'delete_counter')->name('admin.delete_counter');
            Route::post('/save-welcome-text', 'save_welcome_text')->name('admin.save-welcome-text');
            Route::post('/save-enable-ordering', 'save_enable_ordering')->name('admin.save-enable-ordering');
            Route::post('/save-shop-image', 'save_shop_image')->name('admin.save_shop_image');
            Route::get('/detail_customer/{counter_id}', 'detail_customer')->name('admin.detail_customer');
        });
    });
});

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'shop_name',
        'shop_name_ar',
        'email',
        'password',
        'shop_id',
        'active',
        'welcome_text',
        'welcome_text_ar',
        'enable_ordering',
        'ordering_counter',
        'images'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            // 'images' => 'array',
        ];
    }

    protected $casts = [
        'images' => 'array',  // Automatically cast images to an array
        'enable_ordering'  => 'boolean',
    ];

    public function getEncryptedUserAttribute()
    {
        return encrypt($this->id);
    }

    public function counters(): HasMany
    {
        return $this->hasMany(Token::class, 'user_id', 'id');
    }



    public function kiskcounters(): HasMany
    {
        return $this->hasMany(Token::class, 'user_id', 'id')
            ->where('kiosk_mode', 1);
    }

    protected $appends = ['encrypted_user'];
}

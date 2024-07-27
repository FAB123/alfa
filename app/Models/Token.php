<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'count',
        'max_count',
        'kiosk_mode',
        'user_id',
        'last_reset'
    ];

    protected $hidden = [
        'id',
    ];

    public function getEncryptedCounterAttribute()
    {
        return encrypt($this->id);
    }

    protected $appends = ['encrypted_counter'];
}

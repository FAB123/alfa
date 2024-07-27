<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderedItem extends Model
{
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $primaryKey = 'track_id';

    protected function tags(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }

    public function item(): HasOne
    {
        return $this->HasOne(Item::class, 'item_id', 'item_id');
    }
}

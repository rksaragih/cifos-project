<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';
    protected $fillable = [
        'order_id',
        'status',
        'payment_type',
        'transaction_id',
        'gross_amount',
        'response',
    ];

    protected $casts = [
        'response' => 'array',
    ];

    public function reservation()
    {
        return $this->hasOne(Reservation::class, 'payment_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->order_id)) {
                $today = now()->format('Ymd');
                
                $lastPayment = self::whereDate('created_at', now()->toDateString())
                    ->orderBy('created_at', 'desc')
                    ->first();

                $lastNumber = 0;
                if ($lastPayment && preg_match('/PAY-\d{8}-(\d+)/', $lastPayment->order_id, $matches)) {
                    $lastNumber = (int) $matches[1];
                }

                $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
                $payment->order_id = 'PAY-' . $today . '-' . $newNumber;
            }
        });
    }
}

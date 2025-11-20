<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->string('kode_reservasi')->primary();
            $table->string('nama_pelanggan');
            $table->string('nomor_wa');
            $table->date('tanggal');
            $table->time('jam');
            $table->string('kategori_jumlah');
            $table->integer('jumlah_orang');
            $table->text('catatan')->nullable();
            $table->decimal('total_dp', 12, 2);
            $table->enum('status_dp', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('status_reservasi', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

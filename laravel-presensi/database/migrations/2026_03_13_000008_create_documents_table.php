<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('file_path');
            $table->uuid('owner_id');
            $table->uuid('uploader_id');
            $table->uuid('company_id');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('uploader_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};

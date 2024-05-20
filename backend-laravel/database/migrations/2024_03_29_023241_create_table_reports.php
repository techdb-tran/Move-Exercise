<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('reported_user_id');
            $table->unsignedBigInteger('type_report_id');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('reported_user_id')->references('id')->on('users');
            $table->foreign('type_report_id')->references('id')->on('type_report');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reports');

    }
};

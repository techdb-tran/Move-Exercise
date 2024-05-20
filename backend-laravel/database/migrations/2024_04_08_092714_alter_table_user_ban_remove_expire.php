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
        Schema::table('user_bans', function (Blueprint $table) {
            $table->dropColumn("is_ban");
            $table->boolean('is_permaban');
            $table->dropColumn("expire_ban");
            $table->dropColumn('ban_at');
            $table->timestamp('ban_expired_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_bans', function (Blueprint $table) {
            $table->integer('expire_ban');
            $table->boolean('is_ban');
            $table->dropColumn('is_permaban');
            $table->timestamp('ban_at')->nullable();
        });
    }
};

<?php

use App\Enums\DurationVideo;
use App\Enums\LevelVideo;
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
        Schema::table('videos', function (Blueprint $table) {
            $table->enum('level', [
                LevelVideo::BEGINNER,
                LevelVideo::INTERMEDIATE,
                LevelVideo::ADVANCED,
            ])->nullable();
            $table->enum('duration', [
                DurationVideo::LESS_THAN_30_MINS,
                DurationVideo::LESS_THAN_1_HOUR,
                DurationVideo::MORE_THAN_1_HOUR,
            ])->nullable();
            $table->string('title')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn("level");
            $table->dropColumn("duration");
            $table->dropColumn('title');
        });
    }
};

<?php

namespace App\Providers;

use App\Repositories\AdminRepository;
use App\Repositories\Interfaces\AdminRepositoryInterface;
use App\Repositories\Interfaces\ReportUserRepositoryInterface;
use App\Repositories\Interfaces\TypeReportRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\VideoRepositoryInterface;
use App\Repositories\ReportUserRepository;
use App\Repositories\TypeReportRepository;
use App\Repositories\UserRepository;
use App\Repositories\VideoRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton(TypeReportRepositoryInterface::class, TypeReportRepository::class);
        $this->app->singleton(ReportUserRepositoryInterface::class, ReportUserRepository::class);
        $this->app->singleton(UserRepositoryInterface::class, UserRepository::class);
        $this->app->singleton(AdminRepositoryInterface::class, AdminRepository::class);
        $this->app->singleton(VideoRepositoryInterface::class, VideoRepository::class);
    }
}

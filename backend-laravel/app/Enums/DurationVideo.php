<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class DurationVideo extends Enum
{
    public const LESS_THAN_30_MINS = 'less_than_30_mins';
    public const LESS_THAN_1_HOUR = 'less_than_1_hour';
    public const MORE_THAN_1_HOUR = 'more_than_1_hour';
}

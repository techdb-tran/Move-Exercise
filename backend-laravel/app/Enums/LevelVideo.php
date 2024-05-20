<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class LevelVideo extends Enum
{
    public const BEGINNER = "Beginner";
    public const INTERMEDIATE = "Intermediate";
    public const ADVANCED = "Advanced";
}

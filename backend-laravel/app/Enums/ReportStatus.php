<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ReportStatus extends Enum
{
    public const PENDING = "Pending";
    public const UNDER_REVIEW = "UnderReview";
    public const PROCESSING = "Processing";
    public const RESOLVED = "Resolved";
    public const REJECTED = "Rejected";
}

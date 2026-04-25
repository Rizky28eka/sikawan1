<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class AttendanceData extends Data
{
    public function __construct(
        #[Required, StringType]
        public ?string $image_base64,

        #[ArrayType]
        public ?array $images_base64,

        #[Required, Numeric]
        public float $latitude,

        #[Required, Numeric]
        public float $longitude,

        #[Required, In(['CLOCK_IN', 'CLOCK_OUT'])]
        public string $type,

        #[ArrayType]
        public ?array $telemetry_biometric,

        #[ArrayType]
        public ?array $telemetry_location,

        #[ArrayType]
        public ?array $telemetry_network,

        #[StringType]
        public ?string $device_fingerprint,
    ) {}
}

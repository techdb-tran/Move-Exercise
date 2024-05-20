<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Password Reset Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are the default lines which match reasons
    | that are given by the password broker for a password update attempt
    | has failed, such as for an invalid token or invalid new password.
    |
    */

    'user.create.type_report_id.required' => 'type_report_id Required!',
    'user.create.reported_user_id.required' => 'reported_user_id Required!',
    'user.create.type_report_id.numeric' => 'Data Bad',
    'user.create.reported_user_id.numeric' => 'Data Bad',
    'user.create.type_report_id.exists' => 'type_report_id Not Exists!',
    'user.create.reported_user_id.exists' => 'reported_user_id Not Exists!',
    'create.exists' => 'You have reported this account before!',
    'delete.id.required' => 'ids Required!',
    'update.status.required' => 'status Required!',
    'update.id.numeric' => 'Data Bad',
];

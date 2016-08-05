<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PagSeguroController extends Controller
{
    public function getSessionId(){
        $credentials = \PagSeguroConfig::getAccountCredentials();
        return [
            'sessionId' => \PagSeguroSessionService::getSession($credentials)
        ];
    }
}

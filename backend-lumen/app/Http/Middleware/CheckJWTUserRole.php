<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckJWTUserRole
{
    public function handle($request, Closure $next, $role)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Ambil payload dari token
            $payload = JWTAuth::parseToken()->getPayload();
            $tokenRole = $payload->get('role');

            if ($tokenRole !== $role) {
                return response()->json(['message' => 'Unauthorized: Wrong role'], 403);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Unauthorized: Invalid token'], 401);
        }

        return $next($request);
    }
}

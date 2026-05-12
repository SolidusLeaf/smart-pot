# Testing Checklist

## Day 1 Tests

| Test | Expected Result | Status |
|---|---|---|
| Backend starts with npm run dev | Server runs on port 3000 | Passed |
| GET / works | Returns backend running message | Passed |
| GET /api/health works | Returns backend status JSON | Passed |
| GET /api/latest works | Returns placeholder latest telemetry | Passed |
| GET /api/history works | Returns empty history array | Passed |
| POST /api/command accepts WATER | Returns success true | Passed |
| POST /api/command rejects empty command | Returns error message | Passed |
| Dashboard starts with npm run dev | Vite opens dashboard | Passed |
| Dashboard cards visible | Four cards are shown | Passed |

## Notes

Day 1 backend and dashboard skeleton tested successfully.
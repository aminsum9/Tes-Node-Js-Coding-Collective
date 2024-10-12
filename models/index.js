import User from './user.js';
import Attendance from './attendance.js';
import Shift from './shift.js';

User.associate({ Attendance });
Attendance.associate({ User, Shift });

Shift.associate({ Attendance });

export { User, Attendance };
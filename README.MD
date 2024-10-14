- use node v21.5.0
- db sql file = employee_attendance_db.sql
- to create user admin:
   POST /api/auth/admin/register
   req body: 
     {
        name: '',
        email: '',
        address: '',
        password: ''
     }
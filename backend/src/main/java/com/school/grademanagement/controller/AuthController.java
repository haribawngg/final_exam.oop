package com.school.grademanagement.controller;

import com.school.grademanagement.dto.LoginRequest;
import com.school.grademanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Object user = authService.login(request);

        if (user != null) {
            return ResponseEntity.ok(user); // Trả về thông tin user nếu đúng
        } else {
            return ResponseEntity.status(401).body("Sai thông tin đăng nhập hoặc sai vai trò!");
        }
    }
}
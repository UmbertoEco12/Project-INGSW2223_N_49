package com.projectApi.RatatouilleApi.User.Controller;

import com.projectApi.RatatouilleApi.User.Repository.AdminService;
import com.projectApi.RatatouilleApi.User.Repository.AuthService;
import com.projectApi.RatatouilleApi.User.Response.IconPathResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequiredArgsConstructor
public class FileUploadController {

    private final ResourceLoader resourceLoader;
    private final AdminService repository;
    private final AuthService authRepository;
    @Value("${upload.directory}")
    private String uploadDirectory;
    @PostMapping("/admins/upload")
    public ResponseEntity<String> uploadIcon(@RequestParam("file") MultipartFile file){
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            // Get the path to the uploads directory
            Path uploadPath = Path.of(System.getProperty("user.dir"), uploadDirectory);

            // Create the directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectory(uploadPath);
            }
            // get authenticated admin username and activity id.
            var username = AuthController.getAuthenticatedUserUsername();
            var activityId= authRepository.findByUsername(username).getActivityId();
            // write the file as activity id since each activity can have only one icon.
            String fileName = activityId.toString();//System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = Path.of(System.getProperty("user.dir"), uploadDirectory, fileName);
            System.out.println(targetPath);
            // automatically delete the previous icon.
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // save in database
            var activity = repository.updateActivityIcon(username, fileName);
            return ResponseEntity.status(HttpStatus.CREATED).body(fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/icon/{filePath}")
    public ResponseEntity<Resource> getImage(@PathVariable String filePath) {
        try {
            // Load the image as a resource
            Resource resource = resourceLoader.getResource("file:" + "uploads/" + filePath);

            // Check if the resource exists
            if (resource.exists()) {

                return ResponseEntity.ok()
                        .header("Content-Type", "image/jpeg")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Handle exceptions (e.g., file not found, etc.)
            return ResponseEntity.status(500).build();
        }
    }
}

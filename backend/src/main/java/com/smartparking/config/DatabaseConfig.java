package com.smartparking.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.net.URI;

@Slf4j
@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();

        // Read env variables
        String rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        String dbUrl = System.getenv("DATABASE_URL");
        String dbPublicUrl = System.getenv("DATABASE_PUBLIC_URL");

        String pghost = System.getenv("PGHOST");
        String pgport = System.getenv("PGPORT");
        String pgdatabase = System.getenv("PGDATABASE");
        String pguser = System.getenv("PGUSER");
        String pgpassword = System.getenv("PGPASSWORD");

        String selectedUrl = rawUrl != null && !rawUrl.isBlank() ? rawUrl :
                             dbPublicUrl != null && !dbPublicUrl.isBlank() ? dbPublicUrl :
                             dbUrl;

        String finalUrl = null;
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        if (selectedUrl != null && selectedUrl.contains("@")) {
            // URL contains user:password@host:port/db format -> parse it safely for JDBC
            try {
                String cleanUrl = selectedUrl.replace("jdbc:", "");
                URI uri = URI.create(cleanUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    if (username == null || username.isBlank()) {
                        username = userInfo[0];
                    }
                    if (password == null || password.isBlank() && userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();

                finalUrl = "jdbc:postgresql://" + host + ":" + port + path;
                log.info("Parsed Railway DATABASE_URL successfully for host: {}, port: {}", host, port);
            } catch (Exception e) {
                log.warn("Failed to parse URI from raw URL: {}", e.getMessage());
            }
        }

        if (finalUrl == null) {
            if (selectedUrl != null && !selectedUrl.isBlank()) {
                finalUrl = selectedUrl.startsWith("jdbc:") ? selectedUrl : "jdbc:" + selectedUrl;
            } else if (pghost != null && !pghost.isBlank()) {
                int port = (pgport != null && !pgport.isBlank()) ? Integer.parseInt(pgport) : 5432;
                String db = (pgdatabase != null && !pgdatabase.isBlank()) ? pgdatabase : "railway";
                finalUrl = "jdbc:postgresql://" + pghost + ":" + port + "/" + db;
            } else {
                finalUrl = "jdbc:postgresql://localhost:5432/railway";
            }
        }

        if (username == null || username.isBlank()) {
            username = pguser != null ? pguser : "postgres";
        }
        if (password == null || password.isBlank()) {
            password = pgpassword != null ? pgpassword : "";
        }

        properties.setDriverClassName("org.postgresql.Driver");
        properties.setUrl(finalUrl);
        properties.setUsername(username);
        properties.setPassword(password);

        log.info("Configured PostgreSQL DataSource with URL: {}, Username: {}", finalUrl, username);

        return properties;
    }
}

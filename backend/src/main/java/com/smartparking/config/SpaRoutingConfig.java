package com.smartparking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class SpaRoutingConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Do not intercept API requests or Swagger docs
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("v3/api-docs") || resourcePath.startsWith("swagger-ui")) {
                            return null;
                        }
                        Resource requestedResource = location.createRelative(resourcePath);
                        return (requestedResource.exists() && requestedResource.isReadable()) ? requestedResource
                                : new ClassPathResource("/static/index.html");
                    }
                });
    }
}


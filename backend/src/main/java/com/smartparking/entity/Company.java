package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Objects;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Company extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "company_code", nullable = false, unique = true, length = 50)
    private String companyCode;

    @Column(name = "layout_config", columnDefinition = "TEXT")
    private String layoutConfig;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Company company = (Company) o;
        return getId() != null && Objects.equals(getId(), company.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

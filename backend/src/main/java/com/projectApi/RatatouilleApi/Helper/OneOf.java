package com.projectApi.RatatouilleApi.Helper;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Used in Requests.
 * Indicates that at least one field with the specified ID must not be null.
 * This annotation can be applied to fields of classes.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface OneOf {
    /**
     * The ID associated with the fields that are part of the one-of condition.
     * Fields with the same ID are considered part of the same group, and at least
     * one field in the group must not be null.
     *
     * @return The ID associated with the one-of condition.
     */
    int id();
}
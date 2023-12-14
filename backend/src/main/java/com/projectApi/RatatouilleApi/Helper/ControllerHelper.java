package com.projectApi.RatatouilleApi.Helper;

import jakarta.validation.constraints.*;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.HashMap;

public final class ControllerHelper {

    public static boolean isRequestInvalid(Object request)
    {
        try
        {
            return !parseRequest(request);
        }catch (IllegalAccessException e)
        {
            e.printStackTrace();
            return false;
        }
    }
    private static boolean isNotJavaStandardField(Field field) {
        return !field.getDeclaringClass().equals(Object.class);
    }
    public static boolean parseRequest(Object request) throws IllegalAccessException
    {
        Class<?> clazz = request.getClass();
        Field[] fields = clazz.getDeclaredFields();
        HashMap<Integer, Boolean> oneOfCondition = new HashMap<>();
        for (Field field : fields) {
            if (field.isAnnotationPresent(NotNull.class) || field.isAnnotationPresent(Required.class)) {
                field.setAccessible(true); // This is necessary if the field is private
                var obj = field.get(request);
                if ( obj == null) {
                    System.out.println("NotNull not satisfied");
                    return false;
                }
                else
                {
                    if(obj.getClass().isArray()){
                        Object[] array = (Object[]) obj;

                        for (Object element : array) {
                            if(!parseRequest(element))
                            {
                                return false;
                            }
                        }
                    }
                    else if(isNotJavaStandardField(field) && !parseRequest(obj))
                    {
                        return false;
                    }
                }
            }
            if(field.isAnnotationPresent(NotBlank.class)){

                field.setAccessible(true); // This is necessary if the field is private
                var obj = field.get(request);
                if(obj == null || obj.equals("")){
                    System.out.println("NotBlank not satisfied");
                    return false;
                }
            }
            if(field.isAnnotationPresent(Positive.class)){
                field.setAccessible(true); // This is necessary if the field is private
                var obj = field.get(request);
                if(Number.class.isAssignableFrom(obj.getClass())){
                    if( ((Number)obj).doubleValue() <= 0) {
                        System.out.println("Positive not satisfied");
                        return false;
                    }
                }
            }
            if(field.isAnnotationPresent(PositiveOrZero.class)){
                field.setAccessible(true); // This is necessary if the field is private
                var obj = field.get(request);
                if(Number.class.isAssignableFrom(obj.getClass())){
                    if( ((Number)obj).doubleValue() < 0) {
                        System.out.println("PositiveOrZero not satisfied");
                        return false;
                    }
                }
            }
            if(field.isAnnotationPresent(NotEmpty.class)){
                field.setAccessible(true); // This is necessary if the field is private
                var obj = field.get(request);
                if(obj.getClass().isArray()){
                    var length = Array.getLength(obj);
                    if( length <= 0) {
                        System.out.println("NotEmpty not satisfied");
                        return false;
                    }
                }
            }
            if (field.isAnnotationPresent(OneOf.class)) {
                OneOf oneOfAnnotation = field.getAnnotation(OneOf.class);
                int id = oneOfAnnotation.id();
                field.setAccessible(true);
                var obj = field.get(request);
                if ( obj != null) {
                    // At least one field with the same ID is not null
                    oneOfCondition.put(id, true);
                    if(isNotJavaStandardField(field) && !parseRequest(obj))
                    {
                        return false;
                    }
                }
                else
                {
                    oneOfCondition.putIfAbsent(id, false);
                }
            }

        }
        // check oneOf condition
        for (var value:
                oneOfCondition.values()) {
            // one or more oneOf condition are not satisfied.
            if(!value)
            {
                System.out.println("OneOf not satisfied");
                return false;
            }

        }
        return true;
    }
}

CREATE OR REPLACE FUNCTION clean_string(p_original_string TEXT)
RETURNS TEXT
AS $$
DECLARE
    cleaned_string TEXT;
BEGIN
    -- Remove leading and trailing spaces and replace consecutive spaces with a single space
    cleaned_string := REGEXP_REPLACE(TRIM(BOTH ' ' FROM p_original_string), ' +', ' ');

    -- Return the cleaned string
    RETURN lower(cleaned_string);
END;
$$ LANGUAGE plpgsql;
import psycopg2


import sys

if len(sys.argv) != 3:
    print("Usage: python script.py <user_id> <new_tenant_id>")
    sys.exit(1)

user_id = sys.argv[1]
new_tenant_id = sys.argv[2]

# Define the connection string
conn_string = "dbname=postgres user=postgres password=postgres host=localhost port=5000"

try:
    # Establish the connection
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    # Define the UPDATE query
    update_query = """
        UPDATE users
        SET tenant_id = %s
        WHERE id = %s;
    """

    # Execute the query with parameters
    cursor.execute(update_query, (new_tenant_id, user_id))

    # Commit the transaction
    conn.commit()

    print("Update successful!")

except psycopg2.Error as e:
    print("Error updating the table:", e)

finally:
    # Close the cursor and connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()

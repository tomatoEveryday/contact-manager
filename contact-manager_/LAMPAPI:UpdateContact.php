<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit(0);
	}

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // Check if the contact exists and belongs to the user
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ii", $inData["ID"], $inData["UserID"]); // ID is the personal contactid assigned
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0)
        {
            // Update the contact's details
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
            $stmt->bind_param("ssssii", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ID"], $inData["UserID"]);

            if ($stmt->execute())
            {
                returnWithInfo("Contact updated successfully");
            }
            else
            {
                returnWithError("Failed to update contact");
            }
        }
        else
        {
            returnWithError("Contact not found or does not belong to the user");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg)
    {
        $retValue = '{"results":"","error":"' . $msg . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit(0);
	}

    $inData = getRequestInfo();
    
    $contactId = $inData["ID"];  //certain id of contact that is to be deleted

    //is id passed in a number?
    if (!isset($contactId) || !is_numeric($contactId)) {
        returnWithError("Invalid ID provided.");
        exit;
    }

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);

    } else {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $contactId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithError("");
        } else {
            returnWithError("No contact found with the provided ID.");
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
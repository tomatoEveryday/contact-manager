<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit(0);
	}

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); //username and password

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$pageNumber = isset($inData['Page']) ? $inData['Page'] : 1;
		$itemsPerPage = 10;
		error_log("Page number: $pageNumber, Items per page: $itemsPerPage"); // debugging!

		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ? OR Phone like ? OR Email like ?) and UserID = ? ORDER BY LastName"); //search based on whatever user would like but order by last name
		$searchName = "%" . $inData["Search"] . "%";
		$stmt->bind_param("ssssi", $searchName, $searchName, $searchName, $searchName, $inData["UserID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc()) //grab every contact with the specific search query
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '","UserID":"' . $row["ID"] . '"}'; //provides a json object of the contact
		}
		
		if( $searchCount == 0 ) //no contacts found with matching search
		{
			returnWithError( "No Records Found" );
		}
		else //need to paginate here!
		{
			error_log("$searchResults"); // debugging
			$totalRecords = $searchCount; // Use the previously fetched count of records
			$totalPages = ceil($totalRecords / $itemsPerPage);
			$pageNumber = max(1, min($pageNumber, $totalPages));
			$offset = ($pageNumber - 1) * $itemsPerPage;

			/* // Step 6: Slice the results based on the offset and limit
			$paginatedContacts = array_slice($searchResults, $offset, $itemsPerPage);
			error_log($paginatedContacts);
			returnWithInfo($paginatedContacts, $totalRecords, $totalPages, $pageNumber);*/

			$contacts = json_decode("[$searchResults]", true); //into an array
            $paginatedContacts = array_slice($contacts, $offset, $itemsPerPage); //slice the array!
			error_log(json_encode($paginatedContacts)); // debugging!
            returnWithInfo($paginatedContacts, $totalRecords, $totalPages, $pageNumber);
			

		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($searchResults, $totalRecords, $totalPages, $pageNumber)
	{
		// Fix the missing quote and commas in the JSON string
		$retValue = '{"results":[' . json_encode($searchResults) . '], "totalRecords":' . $totalRecords . ', "totalPages":' . $totalPages . ', "pageNumber":' . $pageNumber . ', "error":""}';
		sendResultInfoAsJson($retValue);
	}
	
	
?>
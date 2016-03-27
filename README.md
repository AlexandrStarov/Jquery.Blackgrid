# BlackGrid
## Installation
### Download [jQuery](http://docs.jquery.com/Downloading_jQuery)
* [Download the latest release](http://docs.jquery.com/Downloading_jQuery)
* [Clone in Windows](github-windows://openRepo/https://github.com/jquery/jquery)
* Clone the repo: `git clone git://github.com/jquery/jquery.git`.

### Download [Bootstrap](https://github.com/twitter/bootstrap)
* [Download the latest release](https://github.com/twitter/bootstrap/zipball/master).
* [Clone in Windows](github-windows://openRepo/https://github.com/twitter/bootstrap)
* Clone the repo: `git clone git://github.com/twitter/bootstrap.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install bootstrap`.

### Download this plugin.
* [Download the latest release](https://github.com/AlexandrStarov/Jquery.Blackgrid/zipball/master)
* [Clone in Windows](github-windows://openRepo/https://github.com/AlexandrStarov/Jquery.Blackgrid)
* Clone the repo: `git clone git://github.com/AlexandrStarov/Jquery.Blackgrid.git`
### Include files in your HTML. The minimum required for this plugin are:

    <link rel="stylesheet" href="/path/to/bootstrap.css" />
    <script src="/path/to/jquery.js" type="text/javascript"></script>
    <script src="/path/to/bootstrap.js" type="text/javascript"></script>
    <script src="/path/to/jquery.blackgrid.js" type="text/javascript"></script>

## Usage
```javascript
    $.BlackGrid.Create({
            id: 'grid',
            tableClasses: 'table table-responsive table-bordered blackgrid',
            url: '/api/countries/',
            columns: [{ name: "Name", text: "Name" },
                { name: "Description", text: "Description" }]
        });
```
## Configuration
### Table options

<table style="width:100%">
    <thead>
	    <tr>
		    <th width="30%">
			    Name
		    </th>
		    <th width="15%">
			    Type
		    </th>
		    <th width="15%">
			    Default
		    </th>
		    <th width="40%">
			    Description
		    </th>
	    </tr>
    </thead>
    <tbody>
         <tr>
            <td>
                id
            </td>
    		<td>
                string
            </td>
            <td>
                null
            </td>
            <td>
    			Id of div for table.
            </td>
        </tr>
         <tr>
            <td>
                tableClasses
            </td>
    		<td>
                string
            </td>
            <td>
                null
            </td>
            <td>
    			Base classes for table.
            </td>
        </tr>
         <tr>
            <td>
                url
            </td>
    		<td>
                string
            </td>
            <td>
                null
            </td>
            <td>
    			Url for loading data.
            </td>
        </tr>
         <tr>
            <td>
                columns
            </td>
    		<td>
                object
            </td>
            <td>
                []
            </td>
            <td>
    			Columns for table.
            </td>
        </tr>
    </tbody>    
</table>

### Column options

<table style="width:100%">
    <thead>
	    <tr>
		    <th width="30%">
			    Name
		    </th>
		    <th width="15%">
			    Type
		    </th>
		    <th width="15%">
			    Default
		    </th>
		    <th width="40%">
			    Description
		    </th>
	    </tr>
    </thead>
    <tbody>
         <tr>
            <td>
                name
            </td>
    		<td>
                string
            </td>
            <td>
                null
            </td>
             <td>
                 Name of variable data.
             </td>
        </tr>
         <tr>
            <td>
                text
            </td>
    		<td>
                string
            </td>
            <td>
                null
            </td>
            <td>
    			Text of header column.
            </td>
        </tr>
         <tr>
            <td>
                searchable
            </td>
    		<td>
                boolean
            </td>
            <td>
                false
            </td>
            <td>
    			Enable global search for this column.
            </td>
        </tr>
         <tr>
            <td>
                visible
            </td>
    		<td>
                boolean
            </td>
            <td>
                true
            </td>
            <td>
    			Enable display this column.
            </td>
        </tr>
    </tbody>    
</table>

### Search options

<table style="width:100%">
    <thead>
	    <tr>
		    <th width="30%">
			    Name
		    </th>
		    <th width="15%">
			    Type
		    </th>
		    <th width="15%">
			    Default
		    </th>
		    <th width="40%">
			    Description
		    </th>
	    </tr>
    </thead>
    <tbody>
         <tr>
            <td>
                globalSearch
            </td>
    		<td>
                boolean
            </td>
            <td>
                false
            </td>
             <td>
                 Enable global search for table.
             </td>
        </tr>
         <tr>
            <td>
                minimalLength
            </td>
    		<td>
                integer
            </td>
            <td>
                0
            </td>
             <td>
                 Minimal length for search data.
             </td>
        </tr>
    </tbody>    
</table>

<!--## Events-->

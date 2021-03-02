//Bring in json data using D3
d3.json("data/samples.json").then((bbdata) => {
    console.log(bbdata)

    // Create arrays for plots
    var bbsamples = bbdata.samples;
    var otu_ids = bbsamples.map(bbsamples => {
        return bbsamples.otu_ids;
    });
    var otu_labels = bbsamples.map(bbsamples => {
        return bbsamples.otu_labels;
    });
    var otu_sample_values = bbsamples.map(bbsamples => {
        return bbsamples.sample_values;
    });
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(otu_sample_values);

    // bring otus into drop down menu using d3 select
    var names = bbdata.names;
    var dropdownMenu = d3.select("#selDataset");
    names.forEach(name => {
        dropdownMenu.append("option").text(name);
    });

    //create data points & slice data for top 10
    var xvalues = [];
    var yvalues = [];
    var labelvalues = [];

    otu_ids.forEach(array => {
        var slice = array.slice(0, 10);
        //creare text format for OTU ids
        var OTU_id = slice.map(d => "OTU " + d)
        yvalues.push(OTU_id);
    });

    otu_sample_values.forEach(array => {
        var slice = array.slice(0, 10);
        xvalues.push(slice);
    });

    otu_labels.forEach(array => {
        var slice = array.slice(0, 10);
        labelvalues.push(slice);


    });

    //console log to check
    console.log(xvalues);
    console.log(yvalues);
    console.log(labelvalues);


    //write trace for bar plot

    function init() {
        var trace1 = {
            x: xvalues[0].reverse(),
            y: yvalues[0].reverse(),
            text: labelvalues[0].reverse(),
            type: "bar",
            orientation: "h"
        };
        //data
        var barData = [trace1];
        //layout
        var layout = {
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };
        Plotly.newPlot("bar", barData, layout);

        // Write trace for the bubble plot
        trace2 = {
            x: otu_ids[0],
            y: otu_sample_values[0],
            text: otu_labels[0],
            mode: 'markers',
            marker: {
                size: otu_sample_values[0],
                color: otu_ids[0]
            }
        };

        //write layout for bubble plot
        var bubbleLayout = {
            height: 600,
            width: 1200,
            title: "Belly Button Biodiversity"
        };
        //define name of trace2
        var bubbleData = trace2;

        //create bubble plot
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        //show OTU sample metadata
        var keys = Object.keys(bbdata.metadata[0]);
        var values = Object.values(bbdata.metadata[0])
        var metadata = d3.select('#sample-metadata');
        metadata.html("");
        for (var i = 0; i < keys.length; i++) {
            metadata.append("p").text(`${keys[i]}: ${values[i]}`);
        };
    }

    // Call drop down menu on change
    dropdownMenu.on("change", updataOTUData);
    //Change data if Dropdown menu changed
    function updataOTUData() {
        var dataset = dropdownMenu.property("value");
        for (var i = 0; i < bbdata.names.length; i++) {
            if (dataset === bbdata.names[i]) {
                init(i);
                return
            }
            
        };
        
    }
    init()
})

var size = 100, CurrentArray = [], Delay = 5, BarsDiv = document.getElementById( "mainArea" ),
    BarsArray = document.getElementById( "mainArea" ).children;

/******************************** Utils ********************************/
function seekSize() {
    size = +document.getElementById( "SizeSlider" ).value;
    document.getElementById( "currentSize" ).innerHTML = "Size=" + size;
    GenerateArray( 0, 30 );
}

function seekDelay() {
    Delay = +document.getElementById( "DelaySlider" ).value;
    document.getElementById( "currentDelay" ).innerHTML = "Delay=" + Delay;
}

function DrawArray() {
    BarsDiv.innerHTML = "";
    CurrentArray.forEach( ( i ) => {
        let div = document.createElement( "div" );
        div.className = "bar";
        div.setAttribute( "style", "height: " + i + "px" );
        BarsDiv.appendChild( div );
    } );
}

function GenerateArray( descending = 0, start = 30 ) {
    CurrentArray = [];
    for ( let i = size * 5 + start; i > start; i -= 5 ) {
        CurrentArray.push( i );
    }
    if ( descending === 0 ) {
        shuffle( CurrentArray );
    }
    DrawArray();
}

//  modern Fisher – Yates shuffle algorithm
function shuffle( array ) {
    for ( let i = array.length - 1; i > 0; i-- ) {
        let j = Math.floor( Math.random() * ( i + 1 ) );
        [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
    }
}

function pause( DelayTime ) {
    return new Promise( ( resolve, reject ) => {
        setTimeout( ( _ ) => { resolve( 1 ); }, DelayTime );
    } );
}

function ChangeState( state ) {
    document.getElementById( "generateArray" ).disabled = state;
    document.getElementById( "start" ).disabled = state;
    document.getElementById( "SizeSlider" ).disabled = state;
    document.getElementById( "DelaySlider" ).disabled = state;
    document.getElementById( "ListOfAlgorithms" ).disabled = state;
}
/******************************** Utils ********************************/


/******************************** Sorting Algorithms ********************************/
async function merge( lowerBound, middle, upperBound ) {
    let i = lowerBound, j = middle + 1;
    while ( i < j && j <= upperBound ) {
        BarsArray = document.getElementById( "mainArea" ).children;
        let bar1 = +BarsArray[ j ].style.height.slice( 0, BarsArray[ j ].style.height.indexOf( "p" ) );
        let bar2 = +BarsArray[ i ].style.height.slice( 0, BarsArray[ i ].style.height.indexOf( "p" ) );
        if ( bar1 > bar2 ) {
            i++;
        } else {
            let tmp = BarsArray[ j ];
            BarsDiv.removeChild( tmp );
            BarsDiv.insertBefore( tmp, BarsArray[ i ] );
            i++, j++;
        }
        await pause( Delay );
    }
}

async function mergeSort( lowerBound, upperBound ) {
    if ( lowerBound < upperBound ) {
        let middle = Math.floor( lowerBound + ( upperBound - lowerBound ) / 2 );
        await mergeSort( lowerBound, middle );
        await mergeSort( middle + 1, upperBound );
        await merge( lowerBound, middle, upperBound );
    }
}

async function RunMergeSort() {
    await ChangeState( 1 );
    await mergeSort( 0, CurrentArray.length - 1 );
    await ChangeState( 0 );
}


async function BubbleSort() {
    let N = size;
    while ( N > 1 ) {
        let newN = 0;
        for ( let i = 1; i < N; i++ ) {
            if ( BarsArray[ i ].offsetHeight < BarsArray[ i - 1 ].offsetHeight ) {
                BarsDiv.insertBefore( BarsArray[ i ], BarsArray[ i - 1 ] );
                newN = i;
                await pause( Delay );
            }
        }
        n = newN;
    }
}

async function RunBubbleSort() {
    await ChangeState( 1 );
    await BubbleSort();
    await ChangeState( 0 );
}

async function SelectionSort() {
    for ( let i = 0; i < size; i++ ) {
        let minIndex = i;
        for ( let j = i + 1; j < size; j++ ) {
            if ( BarsArray[ j ].offsetHeight < BarsArray[ minIndex ].offsetHeight ) {
                minIndex = j;
            }
        }
        BarsDiv.insertBefore( BarsArray[ minIndex ], BarsArray[ i ] );
        await pause( Delay );
    }
}

async function RunSelectionSort() {
    await ChangeState( 1 );
    await SelectionSort();
    await ChangeState( 0 );
}

async function InsertionSort() {
    let i = 1;
    while ( i < size ) {
        let j = i;
        while ( j > 0 && BarsArray[ j ].offsetHeight < BarsArray[ j - 1 ].offsetHeight ) {
            BarsDiv.insertBefore( BarsArray[ j ], BarsArray[ j - 1 ] );
            j--;
            await pause( Delay );
        }
        i++;
    }
}

async function RunInsertionSort() {
    await ChangeState( 1 );
    await InsertionSort();
    await ChangeState( 0 );
}

/******************************** Sorting Algorithms and Utils ********************************/

/******************************************* Main Runner **************************************/
async function RunAlgorithm() {
    let algo = document.getElementById( "ListOfAlgorithms" ).value;
    console.log( algo );
    if ( algo === "" ) {
        return;
    } else if ( algo === "Merge Sort" ) {
        await RunMergeSort();
    } else if ( algo === "Bubble Sort" ) {
        await RunBubbleSort();
    } else if ( algo === "Selection Sort" ) {
        await RunSelectionSort();
    } else if ( algo === "Insertion Sort" ) {
        await RunInsertionSort();
    }
}
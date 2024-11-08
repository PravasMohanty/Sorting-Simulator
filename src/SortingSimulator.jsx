import React, { useState, useEffect } from 'react';
import './App.css';

const SortingSimulator = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [algorithm, setAlgorithm] = useState('Bubble Sort');
    const [comparingIndices, setComparingIndices] = useState([]);
    const [swappedIndices, setSwappedIndices] = useState([]);
    const [arraySize, setArraySize] = useState(50);
    const [speed, setSpeed] = useState(50);

    useEffect(() => {
        resetArray();
    }, [arraySize]);

    const resetArray = () => {
        const newArray = Array.from({ length: arraySize }, () =>
            Math.floor(Math.random() * 100)
        );
        setArray(newArray);
        setComparingIndices([]);
        setSwappedIndices([]);
    };

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, Math.max(400 - speed * 4, 10)));
    };

    // Helper function to mark completion
    const markArraySorted = () => {
        setComparingIndices([]);
        setSwappedIndices([...Array(array.length).keys()]);
    };

    // Bubble Sort
    const bubbleSort = async () => {
        let arr = [...array];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                setComparingIndices([j, j + 1]);
                await sleep(50);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    setSwappedIndices([j, j + 1]);
                    await sleep(50);
                }
            }
            setSwappedIndices([arr.length - i - 1]);
        }
        markArraySorted();
    };

    // Selection Sort
    const selectionSort = async () => {
        let arr = [...array];
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                setComparingIndices([minIdx, j]);
                await sleep(50);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                setArray([...arr]);
                setSwappedIndices([i, minIdx]);
                await sleep(50);
            }
            setSwappedIndices([...Array(i + 1).keys()]);
        }
        markArraySorted();
    };

    // Insertion Sort
    const insertionSort = async () => {
        let arr = [...array];
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            setComparingIndices([i]);
            await sleep(50);

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                setArray([...arr]);
                setComparingIndices([j]);
                setSwappedIndices([j + 1]);
                await sleep(50);
                j--;
            }
            arr[j + 1] = key;
            setArray([...arr]);
            setSwappedIndices([...Array(i + 1).keys()]);
        }
        markArraySorted();
    };

    // Merge Sort
    const merge = async (arr, left, middle, right) => {
        const n1 = middle - left + 1;
        const n2 = right - middle;
        const L = arr.slice(left, middle + 1);
        const R = arr.slice(middle + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            setComparingIndices([left + i, middle + 1 + j]);
            await sleep(50);

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            setArray([...arr]);
            setSwappedIndices([k]);
            await sleep(50);
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            setArray([...arr]);
            setSwappedIndices([k]);
            await sleep(50);
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            setArray([...arr]);
            setSwappedIndices([k]);
            await sleep(50);
            j++;
            k++;
        }

        // Mark the sorted portion
        const sortedIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
        setSwappedIndices(sortedIndices);
    };

    const mergeSort = async (arr, left, right) => {
        if (left < right) {
            const middle = Math.floor((left + right) / 2);
            await mergeSort(arr, left, middle);
            await mergeSort(arr, middle + 1, right);
            await merge(arr, left, middle, right);
        }
        if (left === 0 && right === arr.length - 1) {
            markArraySorted();
        }
    };

    // Quick Sort
    const partition = async (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            setComparingIndices([j, high]);
            await sleep(50);

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                setSwappedIndices([i, j]);
                await sleep(50);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        setSwappedIndices([i + 1, high]);
        await sleep(50);

        return i + 1;
    };

    const quickSort = async (arr, low, high) => {
        if (low < high) {
            const pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
        if (low === 0 && high === arr.length - 1) {
            markArraySorted();
        }
    };

    const startSorting = async () => {
        setIsSorting(true);
        try {
            const arr = [...array];
            switch (algorithm) {
                case 'Bubble Sort':
                    await bubbleSort();
                    break;
                case 'Selection Sort':
                    await selectionSort();
                    break;
                case 'Insertion Sort':
                    await insertionSort();
                    break;
                case 'Merge Sort':
                    await mergeSort(arr, 0, arr.length - 1);
                    break;
                case 'Quick Sort':
                    await quickSort(arr, 0, arr.length - 1);
                    break;
                default:
                    break;
            }
        } finally {
            setIsSorting(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: '#1a1b26',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1f2937 0%, #1a1b26 100%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="controls-container">
                <div className="controls">
                    <div className="control-group">
                        <select
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                            disabled={isSorting}
                            className="fancy-select"
                        >
                            <option value="Bubble Sort">Bubble Sort</option>
                            <option value="Selection Sort">Selection Sort</option>
                            <option value="Insertion Sort">Insertion Sort</option>
                            <option value="Merge Sort">Merge Sort</option>
                            <option value="Quick Sort">Quick Sort</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <div className="size-control">
                            <span className="size-label">Speed: {speed}%</span>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                disabled={isSorting}
                                className="fancy-slider"
                            />
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="size-control">
                            <span className="size-label">Size: {arraySize}</span>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={arraySize}
                                onChange={(e) => setArraySize(Number(e.target.value))}
                                disabled={isSorting}
                                className="fancy-slider"
                            />
                        </div>
                    </div>

                    <div className="control-group">
                        <button
                            className="fancy-btn reset-btn"
                            onClick={resetArray}
                            disabled={isSorting}
                        >
                            Reset Array
                        </button>
                        <button
                            className="fancy-btn start-btn"
                            onClick={startSorting}
                            disabled={isSorting}
                        >
                            {isSorting ? 'Sorting...' : 'Start Sorting'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                padding: '20px',
            }}>
                {array.map((value, index) => (
                    <div
                        key={index}
                        className="array-bar"
                        style={{
                            height: `${value * 4}px`,
                            width: `${Math.min(Math.floor(window.innerWidth / array.length) - 2, 30)}px`,
                            backgroundColor: comparingIndices.includes(index)
                                ? '#F50634'
                                : swappedIndices.includes(index)
                                    ? '#06F566'
                                    : '#7dcfff',
                            margin: '0 1px',
                            borderRadius: '8px 8px 0 0',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: comparingIndices.includes(index)
                                ? '0 0 20px rgba(245, 6, 52, 0.5)'
                                : swappedIndices.includes(index)
                                    ? '0 0 20px rgba(6, 245, 102, 0.3)'
                                    : '0 0 10px rgba(125, 207, 255, 0.2)',
                            transform: comparingIndices.includes(index)
                                ? 'scaleY(1.02)'
                                : 'scaleY(1)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SortingSimulator;
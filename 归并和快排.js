// 排序数组
// 这题我会用归并排序。归并排序的思路是先递归地把数组不断二分，拆到每个子数组只剩一个元素，因为单个元素天然有序。然后在回溯过程中，把两个有序子数组通过双指针合并成一个更大的有序数组。

var sortArray = function (nums) {
  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
  };

  const merge = (left, right) => {
    let i = 0,
      j = 0;
    const res = [];

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        res.push(left[i]);
        i++;
      } else {
        res.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      res.push(left[i]);
      i++;
    }

    while (j < right.length) {
      res.push(right[j]);
      j++;
    }

    return res;
  };

  return mergeSort(nums);
};

// 快排 分为普通快排 和 原地快排(指针交换)

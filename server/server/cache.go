package server

import (
	"container/list"
	"crypto/sha256"
	"fmt"
	"io"
	"os"
)

func getHash(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, f); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

func areEqual(path1, path2 string) (bool, error) {
	hash1, err := getHash(path1)
	if err != nil {
		return false, err
	}
	hash2, err := getHash(path2)
	if err != nil {
		return false, err
	}

	return hash1 == hash2, nil
}

type hashAndMethod struct {
	hash   string
	method Method
}

type FIFOCache struct {
	capacity int
	cache    map[hashAndMethod][]string
	order    *list.List
}

func newFIFOCache(capacity int) (*FIFOCache, error) {
	if capacity <= 0 {
		return nil, fmt.Errorf("capacity must be greater than 0")
	}

	return &FIFOCache{
		capacity: capacity,
		cache:    make(map[hashAndMethod][]string, capacity),
		order:    list.New(),
	}, nil
}

func (fc *FIFOCache) push(key hashAndMethod, value []string) {
	if len(fc.cache) > fc.capacity {
		oldest := fc.order.Front()
		delete(fc.cache, oldest.Value.(hashAndMethod))
		fc.order.Remove(oldest)
	}

	fc.cache[key] = value
	fc.order.PushBack(key)
}

func (fc *FIFOCache) get(key hashAndMethod) ([]string, bool) {
	if value, ok := fc.cache[key]; ok {
		return value, true
	}
	return nil, false
}

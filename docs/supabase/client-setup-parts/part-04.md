# Source: https://supabase.com/docs/reference/javascript/installing
# Last fetched: 2026-03-27T18:38:37.271521+00:00

# client-setup — Part 4

1

const { data, error } = await supabase

2

.from('countries')

3

.select()

4

.is('name', null)
```

Data source

Response

Notes

---

## Column is in an array

`in(column, values)`

Match only rows where `column` is included in the `values` array.

### Parameters

* columnColumnName

  The column to filter on
* valuesArray

  The values array to filter with

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('characters')

3

.select()

4

.in('name', ['Leia', 'Han'])
```

Data source

Response

---

## Column contains every element in a value

`contains(column, value)`

Only relevant for jsonb, array, and range columns. Match only rows where `column` contains every element appearing in `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1string
  + Option 2Record<string, unknown>
  + Option 3Array<Row['ColumnName']>
  + Option 4Array<unknown>

### Return Type

this

On array columnsOn range columnsOn `jsonb` columns

```
1

const { data, error } = await supabase

2

.from('issues')

3

.select()

4

.contains('tags', ['is:open', 'priority:low'])
```

Data source

Response

---

## Contained by value

`containedBy(column, value)`

Only relevant for jsonb, array, and range columns. Match only rows where every element appearing in `column` is contained by `value`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1string
  + Option 2Record<string, unknown>
  + Option 3Array<Row['ColumnName']>
  + Option 4Array<unknown>

### Return Type

this

On array columnsOn range columnsOn `jsonb` columns

```
1

const { data, error } = await supabase

2

.from('classes')

3

.select('name')

4

.containedBy('days', ['monday', 'tuesday', 'wednesday', 'friday'])
```

Data source

Response

---

## Greater than a range

`rangeGt(column, range)`

Only relevant for range columns. Match only rows where every element in `column` is greater than any element in `range`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* rangestring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('reservations')

3

.select()

4

.rangeGt('during', '[2000-01-02 08:00, 2000-01-02 09:00)')
```

Data source

Response

Notes

---

## Greater than or equal to a range

`rangeGte(column, range)`

Only relevant for range columns. Match only rows where every element in `column` is either contained in `range` or greater than any element in `range`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* rangestring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('reservations')

3

.select()

4

.rangeGte('during', '[2000-01-02 08:30, 2000-01-02 09:30)')
```

Data source

Response

Notes

---

## Less than a range

`rangeLt(column, range)`

Only relevant for range columns. Match only rows where every element in `column` is less than any element in `range`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* rangestring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('reservations')

3

.select()

4

.rangeLt('during', '[2000-01-01 15:00, 2000-01-01 16:00)')
```

Data source

Response

Notes

---

## Less than or equal to a range

`rangeLte(column, range)`

Only relevant for range columns. Match only rows where every element in `column` is either contained in `range` or less than any element in `range`.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* rangestring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('reservations')

3

.select()

4

.rangeLte('during', '[2000-01-01 14:00, 2000-01-01 16:00)')
```

Data source

Response

Notes

---

## Mutually exclusive to a range

`rangeAdjacent(column, range)`

Only relevant for range columns. Match only rows where `column` is mutually exclusive to `range` and there can be no element between the two ranges.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* rangestring

### Return Type

this

With `select()`

```
1

const { data, error } = await supabase

2

.from('reservations')

3

.select()

4

.rangeAdjacent('during', '[2000-01-01 12:00, 2000-01-01 13:00)')
```

Data source

Response

Notes

---

## With a common element

`overlaps(column, value)`

Only relevant for array and range columns. Match only rows where `column` and `value` have an element in common.

### Parameters

* columnOne of the following options

  Details

  + Option 1ColumnName
  + Option 2string
* valueOne of the following options

  Details

  + Option 1string
  + Option 2Array<Row['ColumnName']>
  + Option 3Array<unknown>

### Return Type

this

On array columnsOn range columns

```
1

const { data, error } = await supabase

2

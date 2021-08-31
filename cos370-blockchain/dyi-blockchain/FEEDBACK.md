* You did the extra credit!  Good job. (+5)

* This code leaks memory because when you create a JSON object, you never
  release it.  For jansson, you need to do a `json_decref()` on the `json_t*`
  objects that it creates for you. (-3)

* This code also has trouble by passing pointers to locations that are on
  the stack as if they were heap allocated (-3).

Total: 99

program BubbleSort;

uses
  SysUtils;

type
  TIntArray = array of Integer;

procedure GenerujLiczby(var arr: TIntArray; od, do_, ile: Integer);
var
  i: Integer;
begin
  SetLength(arr, ile);
  Randomize;
  for i := 0 to ile - 1 do
    arr[i] := Random(do_ - od + 1) + od;
end;

procedure SortujLiczby(var arr: TIntArray);
var
  i, j, temp: Integer;
begin
  for i := 0 to Length(arr) - 2 do
    for j := 0 to Length(arr) - 2 - i do
      if arr[j] > arr[j + 1] then
      begin
        temp     := arr[j];
        arr[j]   := arr[j + 1];
        arr[j+1] := temp;
      end;
end;

procedure WypiszLiczby(var arr: TIntArray);
var
  i: Integer;
begin
  for i := 0 to Length(arr) - 1 do
    Write(arr[i], ' ');
  WriteLn;
end;

var
  passed, failed: Integer;

procedure Assert(warunek: Boolean; nazwa: String);
begin
  if warunek then
  begin
    WriteLn('  [PASS] ' + nazwa);
    Inc(passed);
  end
  else
  begin
    WriteLn('  [FAIL] ' + nazwa);
    Inc(failed);
  end;
end;

procedure RunTesty;
var
  arr: TIntArray;
  i: Integer;
  ok: Boolean;
begin
  passed := 0;
  failed := 0;
  WriteLn('Testy jednostkowe');

  WriteLn('Test 1: dlugosc tablicy po generowaniu');
  GenerujLiczby(arr, 0, 100, 50);
  Assert(Length(arr) = 50, 'Tablica ma 50 elementow');

  WriteLn('Test 2: zakres wygenerowanych liczb');
  GenerujLiczby(arr, 10, 50, 100);
  ok := True;
  for i := 0 to Length(arr) - 1 do
    if (arr[i] < 10) or (arr[i] > 50) then
      ok := False;
  Assert(ok, 'Wszystkie liczby w zakresie 10-50');

  WriteLn('Test 3: pierwszy element po sortowaniu');
  GenerujLiczby(arr, 0, 100, 50);
  SortujLiczby(arr);
  Assert(arr[0] <= arr[1], 'Pierwszy element <= drugi');

  WriteLn('Test 4: ostatni element po sortowaniu');
  Assert(arr[Length(arr)-2] <= arr[Length(arr)-1], 'Przedostatni <= ostatni');

  WriteLn('Test 5: cala tablica posortowana rosnaco');
  GenerujLiczby(arr, 0, 100, 50);
  SortujLiczby(arr);
  ok := True;
  for i := 0 to Length(arr) - 2 do
    if arr[i] > arr[i + 1] then
      ok := False;
  Assert(ok, 'Tablica posortowana rosnaco');

  WriteLn('Wynik: ' + IntToStr(passed) + ' passed, ' + IntToStr(failed) + ' failed');
end;

var
  liczby: TIntArray;

begin
  GenerujLiczby(liczby, 0, 100, 50);
  WriteLn('Wygenerowane liczby:');
  WypiszLiczby(liczby);

  SortujLiczby(liczby);
  WriteLn('Posortowane liczby:');
  WypiszLiczby(liczby);

  WriteLn;
  RunTesty;
end.

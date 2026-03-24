program BubbleSort;

uses
  SysUtils;

const
  ARRAY_SIZE = 50;

type
  TIntArray = array[1..ARRAY_SIZE] of Integer;

procedure GenerujLiczby(var arr: TIntArray);
var
  i: Integer;
begin
  Randomize;
  for i := 1 to ARRAY_SIZE do
    arr[i] := Random(101);
end;

procedure SortujLiczby(var arr: TIntArray);
var
  i, j, temp: Integer;
begin
  for i := 1 to ARRAY_SIZE - 1 do
    for j := 1 to ARRAY_SIZE - i do
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
  for i := 1 to ARRAY_SIZE do
    Write(arr[i], ' ');
  WriteLn;
end;

var
  liczby: TIntArray;

begin
  GenerujLiczby(liczby);
  WriteLn('Wygenerowane liczby:');
  WypiszLiczby(liczby);

  SortujLiczby(liczby);
  WriteLn('Posortowane liczby:');
  WypiszLiczby(liczby);
end.

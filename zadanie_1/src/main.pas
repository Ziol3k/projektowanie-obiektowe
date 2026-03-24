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
  liczby: TIntArray;

begin
  GenerujLiczby(liczby, 0, 100, 30);
  WriteLn('Wygenerowane liczby:');
  WypiszLiczby(liczby);

  SortujLiczby(liczby);
  WriteLn('Posortowane liczby:');
  WypiszLiczby(liczby);
end.

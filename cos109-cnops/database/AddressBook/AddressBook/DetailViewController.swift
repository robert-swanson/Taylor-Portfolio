//
//  DetailViewController.swift
//  AddressBook
//
//  Created by Robert Swanson on 4/28/19.
//  Copyright © 2019 Robert Swanson. All rights reserved.
//

import UIKit
import SQLite

class DetailViewController: UITableViewController {

    
    var message: String?
    var masterViewController: MasterViewController?
    var row: Row?
    var rowID: Int64?
    
    var groups: [(Int64, String, String)]?

    override func viewDidLoad() {
        super.viewDidLoad()
        let addGroupButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(addGroup))
        
        navigationItem.rightBarButtonItem = addGroupButton
    }
    
    @objc
    func addGroup(){
        masterViewController?.addGroup(groupName: "group", contactID: rowID!)
        tableView.reloadData()
    }
    //TODO: add group cellls
    // MARK: - Table View
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        groups = masterViewController!.getGroups(contactId: rowID!)
        if groups!.isEmpty{
            return 6
        }else{
            return 7
        }
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0,1,2:
            return 2
        case 6:
            return groups!.count
        default:
            return 1
        }
    }
    //TODO: Handle empty database in GUI
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if(indexPath.section < 5){
            let cell = tableView.dequeueReusableCell(withIdentifier: "property")!
            cell.detailTextLabel?.text = "Content..."
            switch (indexPath.section, indexPath.row) {
            case (0, 0):
                cell.textLabel?.text = "First Name:"
                cell.detailTextLabel?.text = row![masterViewController!.firstNameF]
            case (0, 1):
                cell.textLabel?.text = "Last Name:"
                cell.detailTextLabel?.text = row![masterViewController!.lastNameF]
            case (1,0):
                cell.textLabel?.text = "1st Email:"
                cell.detailTextLabel?.text = row![masterViewController!.primaryEmailF]
            case (1,1):
                cell.textLabel?.text = "2nd Email:"
                cell.detailTextLabel?.text = row![masterViewController!.secondaryEmailF]
            case (2,0):
                cell.textLabel?.text = "1st Phone:"
                cell.detailTextLabel?.text = row![masterViewController!.primaryPhoneF]?.description
            case (2,1):
                cell.textLabel?.text = "2nd Phone:"
                cell.detailTextLabel?.text = row![masterViewController!.secondaryPhoneF]?.description
            case (3,0):
                cell.textLabel?.text = "Organization:"
                cell.detailTextLabel?.text = row![masterViewController!.organizationF]
            default:
                cell.textLabel?.text = "Birthday:"
                cell.detailTextLabel?.text = row![masterViewController!.birthdayF]
            }
            return cell
        }else if indexPath.section == 5{
            let cell = tableView.dequeueReusableCell(withIdentifier: "notes") as! noteCell
            cell.label.text = row![masterViewController!.notesF]
            cell.detail = self
            return cell
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "group")
            cell!.textLabel?.text = groups![indexPath.row].1
            return cell!
        }
    }
    
    override func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        if(indexPath.section == 6){
            let action = UITableViewRowAction(style: .destructive, title: "Delete", handler: {(action,indexPaths)  in
                self.masterViewController?.removeGroup(contactID: self.rowID!, groupID: self.groups![indexPath.row].0)
                tableView.reloadData()
            })
            let note = UITableViewRowAction(style: .normal, title: "Note", handler: { (action, indexPath) in
                self.showInputDialog(title: "Group Notes", subtitle: self.groups![indexPath.row].2, actionTitle: "Update Note", cancelTitle: "Cancel", inputPlaceholder: "Note", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                    print("Change note to \(input!)")
                    self.masterViewController?.editGroupNote(groupID: self.groups![indexPath.row].0, note: input!)
                    self.groups = self.masterViewController?.getGroups(contactId: self.rowID!)
                })
            })
            return [action, note]
        }
        return []
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let origId = row![masterViewController!.contactIdPK]
        switch (indexPath.section, indexPath.row) {
        case (0, 0):
            showInputDialog(title: "Edit First Name", subtitle: "Input the first name of the contact (required)", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "First Name", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.firstNameF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
                self.title = self.row![self.masterViewController!.firstNameF] + " " + self.row![self.masterViewController!.lastNameF]
            })
        case (0, 1):
            showInputDialog(title: "Edit Second Name", subtitle: "Input the last name of the contact (required)", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Last Name", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.lastNameF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
                self.title = self.row![self.masterViewController!.firstNameF] + " " + self.row![self.masterViewController!.lastNameF]
            })
        case (1,0):
            showInputDialog(title: "Edit Primary Email", subtitle: "Input the primary email of the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Email", inputKeyboardType: .emailAddress, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.primaryEmailF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (1,1):
            showInputDialog(title: "Edit Secondary Email", subtitle: "Input the secondary email of the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Email", inputKeyboardType: .emailAddress, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.secondaryEmailF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (2,0):
            showInputDialog(title: "Edit Primary Phone", subtitle: "Input the primary phone number of the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Phone", inputKeyboardType: .phonePad, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.primaryPhoneF, value: Int64(input!))
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (2,1):
            showInputDialog(title: "Edit Secondary Phone", subtitle: "Input the secondary phone number of the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Phone", inputKeyboardType: .phonePad, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.secondaryPhoneF, value: Int64(input!))
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (3,0):
            showInputDialog(title: "Edit Organization", subtitle: "Input the organization for the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Organization", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.organizationF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (4,0):
            showInputDialog(title: "Edit Birthday", subtitle: "Input the birthday for the contact", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "1999-12-11", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                self.masterViewController!.updateRow(id: self.row![self.masterViewController!.contactIdPK], col: self.masterViewController!.birthdayF, value: input!)
                self.row = self.masterViewController!.updateSelection(id: origId)
                tableView.reloadRows(at: [indexPath], with: .automatic)
            })
        case (5,0):
            print("Notes")
        default:
            showInputDialog(title: "Edit Group", subtitle: "Input the name of a group that exists, or the name of a new group", actionTitle: "OK", cancelTitle: "Cancel", inputPlaceholder: "Group Name", inputKeyboardType: .default, cancelHandler: nil, actionHandler: { (input: String?) -> Void in
                let group = self.masterViewController?.getGroups(contactId: self.rowID!)[indexPath.row]
                self.masterViewController?.removeGroup(contactID: self.rowID!, groupID: group!.0)
                self.masterViewController?.addGroup(groupName: input!, contactID: self.rowID!)
                
//                tableView.reloadRows(at: [indexPath], with: .automatic)
                tableView.reloadData()
            })
        }
        tableView.deselectRow(at: indexPath, animated: true)
        
    }
    
}


//Credit to Gunhan: https://stackoverflow.com/a/48065833/6658911
extension UIViewController {
    func showInputDialog(title:String? = nil,
                         subtitle:String? = nil,
                         actionTitle:String? = "Add",
                         cancelTitle:String? = "Cancel",
                         inputPlaceholder:String? = nil,
                         inputKeyboardType:UIKeyboardType = UIKeyboardType.default,
                         cancelHandler: ((UIAlertAction) -> Swift.Void)? = nil,
                         actionHandler: ((_ text: String?) -> Void)? = nil) {
        
        let alert = UIAlertController(title: title, message: subtitle, preferredStyle: .alert)
        alert.addTextField { (textField:UITextField) in
            textField.placeholder = inputPlaceholder
            textField.keyboardType = inputKeyboardType
        }
        alert.addAction(UIAlertAction(title: actionTitle, style: .destructive, handler: { (action:UIAlertAction) in
            guard let textField =  alert.textFields?.first else {
                actionHandler?(nil)
                return
            }
            actionHandler?(textField.text)
        }))
        alert.addAction(UIAlertAction(title: cancelTitle, style: .cancel, handler: cancelHandler))
        
        self.present(alert, animated: true, completion: nil)
    }
}
